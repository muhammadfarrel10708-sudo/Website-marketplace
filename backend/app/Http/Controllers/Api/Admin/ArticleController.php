<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ArticleRequest;
use App\Http\Resources\ArticleResource;
use App\Models\Article;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;

class ArticleController extends Controller
{
    private const DISK = 'uploads';

    public function index(\Illuminate\Http\Request $request): AnonymousResourceCollection
    {
        $placement = $request->query('placement', 'home');
        abort_unless(in_array($placement, ['home', 'menu'], true), 422, 'Placement artikel tidak valid.');
        return ArticleResource::collection(Article::query()->where('placement', $placement)->orderByDesc('published_at')->orderBy('sort_order')->orderByDesc('id')->get());
    }

    public function store(ArticleRequest $request): JsonResponse
    {
        $data = $request->safe()->except(['image']);
        if ($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store('articles', self::DISK);
        }
        $data['placement'] = $data['placement'] ?? 'home';
        $data['is_active'] = $request->boolean('is_active', true);
        $data['image_zoom'] = $data['image_zoom'] ?? 1;
        $data['image_position_x'] = $data['image_position_x'] ?? 0;
        $data['image_position_y'] = $data['image_position_y'] ?? 0;
        $data['sort_order'] = $data['sort_order'] ?? ((int) Article::where('placement', $data['placement'])->max('sort_order') + 1);
        $data['slug'] = $this->uniqueSlug($data['slug'], null, $data['placement']);

        $article = Article::create($data);
        return (new ArticleResource($article))->response()->setStatusCode(201);
    }

    public function update(ArticleRequest $request, Article $article): ArticleResource
    {
        $data = $request->safe()->except(['image']);
        if ($request->has('is_active')) $data['is_active'] = $request->boolean('is_active');
        if ($request->has('slug')) $data['slug'] = $this->uniqueSlug($data['slug'], $article->id, $request->input('placement', $article->placement));
        if ($request->has('placement')) $data['placement'] = $request->input('placement');

        $oldImage = null;
        if ($request->hasFile('image')) {
            $oldImage = $article->image_path;
            $data['image_path'] = $request->file('image')->store('articles', self::DISK);
        }
        $article->update($data);
        if ($oldImage) Storage::disk(self::DISK)->delete($oldImage);

        return new ArticleResource($article->refresh());
    }

    public function destroy(Article $article): Response
    {
        $imagePath = $article->image_path;
        $article->delete();
        if ($imagePath) Storage::disk(self::DISK)->delete($imagePath);
        return response()->noContent();
    }

    private function uniqueSlug(string $slug, ?int $ignoreId = null, string $placement = 'home'): string
    {
        $base = $slug !== '' ? $slug : 'artikel';
        $candidate = $base;
        $n = 2;
        while (Article::where('slug', $candidate)->where('placement', $placement)->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))->exists()) {
            $candidate = $base.'-'.$n++;
        }
        return $candidate;
    }
}
