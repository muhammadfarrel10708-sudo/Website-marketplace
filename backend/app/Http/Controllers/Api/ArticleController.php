<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ArticleResource;
use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ArticleController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $placement = $request->query('placement', 'home');
        abort_unless(in_array($placement, ['home', 'menu'], true), 422, 'Placement artikel tidak valid.');
        return ArticleResource::collection(Article::active()->where('placement', $placement)->ordered()->get());
    }

    public function show(Request $request, string $slug): ArticleResource
    {
        $placement = $request->query('placement', 'menu');
        abort_unless(in_array($placement, ['home', 'menu'], true), 422, 'Placement artikel tidak valid.');
        return new ArticleResource(Article::active()->where('placement', $placement)->where('slug', $slug)->firstOrFail());
    }
}
