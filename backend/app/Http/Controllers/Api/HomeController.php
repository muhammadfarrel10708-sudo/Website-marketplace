<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AboutContent;
use App\Models\Advantage;
use App\Models\Article;
use App\Models\CompanyStat;
use App\Models\Hero;
use App\Models\Product;
use App\Models\Section;
use App\Models\Service;
use App\Models\ServiceArea;
use App\Models\WorkStep;
use App\Http\Resources\AboutContentResource;
use App\Http\Resources\AdvantageResource;
use App\Http\Resources\ArticleResource;
use App\Http\Resources\CompanyStatResource;
use App\Http\Resources\HeroResource;
use App\Http\Resources\ProductResource;
use App\Http\Resources\ServiceAreaResource;
use App\Http\Resources\ServiceResource;
use App\Http\Resources\WorkStepResource;
use Illuminate\Http\JsonResponse;

class HomeController extends Controller
{
    public function index(): JsonResponse
    {
        $sections = Section::whereIn('key', [
            'cara_kerja', 'layanan_home', 'area_layanan', 'produk', 'kenapa_pilih_kami', 'statistik_perusahaan', 'info_terbaru',
        ])->get()->keyBy('key');

        $list = fn ($resource, $query) => $resource::collection($query->get())->resolve();

        return response()->json([
            'heroes' => $list(HeroResource::class, Hero::active()->ordered()),
            'about_contents' => $list(AboutContentResource::class, AboutContent::active()->ordered()),
            'work_steps' => $list(WorkStepResource::class, WorkStep::active()->ordered()),
            'services' => $list(ServiceResource::class, Service::active()->ordered()->where('placement', 'home')),
            'service_areas' => $list(ServiceAreaResource::class, ServiceArea::active()->ordered()),
            'products' => $list(ProductResource::class, Product::active()->ordered()),
            'advantages' => $list(AdvantageResource::class, Advantage::active()->ordered()),
            'company_stats' => $list(CompanyStatResource::class, CompanyStat::active()->ordered()),
            'articles' => $list(ArticleResource::class, Article::active()->ordered()->where('placement', 'home')),
            'sections' => $sections->map(fn ($x) => [
                'key' => $x->key, 'title' => $x->title, 'subtitle' => $x->subtitle,
            ])->values(),
        ]);
    }
}
