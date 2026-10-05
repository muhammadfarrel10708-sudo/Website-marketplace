<?php

use App\Http\Controllers\Api\Admin\HeroController as AdminHeroController;
use App\Http\Controllers\Api\Admin\AboutContentController as AdminAboutContentController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\Admin\SectionController as AdminSectionController;
use App\Http\Controllers\Api\Admin\WorkStepController as AdminWorkStepController;
use App\Http\Controllers\Api\Admin\ServiceController as AdminServiceController;
use App\Http\Controllers\Api\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Api\Admin\ArticleController as AdminArticleController;
use App\Http\Controllers\Api\Admin\AdvantageController as AdminAdvantageController;
use App\Http\Controllers\Api\Admin\CompanyStatController as AdminCompanyStatController;
use App\Http\Controllers\Api\HeroController;
use App\Http\Controllers\Api\AboutContentController;
use App\Http\Controllers\Api\AboutPageController;
use App\Http\Controllers\Api\Admin\AboutPageItemController as AdminAboutPageItemController;
use App\Http\Controllers\Api\Admin\PortfolioItemController as AdminPortfolioItemController;
use App\Http\Controllers\Api\Admin\PortfolioBrandController as AdminPortfolioBrandController;
use App\Http\Controllers\Api\PortfolioController;
use App\Http\Controllers\Api\Admin\ServiceAreaController as AdminServiceAreaController;
use App\Http\Controllers\Api\SectionController;
use App\Http\Controllers\Api\ServiceAreaController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ArticleController;
use App\Http\Controllers\Api\AdvantageController;
use App\Http\Controllers\Api\CompanyStatController;
use App\Http\Controllers\Api\WorkStepController;
use Illuminate\Support\Facades\Route;

// ---- Publik (dipakai landing page) ----
Route::get('/heroes', [HeroController::class, 'index'])->name('heroes.index');
Route::get('/about-contents', [AboutContentController::class, 'index']);
Route::get('/about-page', [AboutPageController::class, 'index']);
Route::get('/portfolio', [PortfolioController::class, 'index']);
Route::get('/portfolio-brands', [PortfolioController::class, 'brands']);
Route::get('/portfolio-brands/{portfolioBrand}/image', [PortfolioController::class, 'brandImage'])->name('portfolio.brands.image');
Route::get('/work-steps', [WorkStepController::class, 'index']);
Route::get('/sections/{key}', [SectionController::class, 'show']);
Route::get('/services', [ServiceController::class, 'index']);
Route::get('/service-areas', [ServiceAreaController::class, 'index']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/articles', [ArticleController::class, 'index']);
Route::get('/articles/{slug}', [ArticleController::class, 'show']);
Route::get('/advantages', [AdvantageController::class, 'index']);
Route::get('/company-stats', [CompanyStatController::class, 'index']);

// Maksimal 5 percobaan login per menit per IP
Route::post('/login', [AuthController::class, 'login'])
    ->middleware('throttle:5,1')
    ->name('login');

// ---- Admin (wajib membawa token login) ----
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::prefix('admin')->group(function () {
        Route::apiResource('heroes', AdminHeroController::class)->names('admin.heroes');
        Route::apiResource('about-contents', AdminAboutContentController::class)->except(['show'])->parameters(['about-contents' => 'aboutContent'])->names('admin.about-contents');
        Route::apiResource('about-page-items', AdminAboutPageItemController::class)->except(['show'])->parameters(['about-page-items' => 'aboutPageItem'])->names('admin.about-page-items');
        Route::apiResource('portfolio-items', AdminPortfolioItemController::class)->except(['show'])->parameters(['portfolio-items' => 'portfolioItem'])->names('admin.portfolio-items');
        Route::apiResource('portfolio-brands', AdminPortfolioBrandController::class)->except(['show'])->parameters(['portfolio-brands' => 'portfolioBrand'])->names('admin.portfolio-brands');
        Route::apiResource('work-steps', AdminWorkStepController::class)->except(['show'])->names('admin.work-steps');
        Route::apiResource('services', AdminServiceController::class)->except(['show'])->names('admin.services');
        Route::apiResource('service-areas', AdminServiceAreaController::class)->except(['show'])->names('admin.service-areas');
        Route::apiResource('products', AdminProductController::class)->except(['show'])->names('admin.products');
        Route::apiResource('articles', AdminArticleController::class)->except(['show'])->names('admin.articles');
        Route::apiResource('advantages', AdminAdvantageController::class)->except(['show'])->names('admin.advantages');
        Route::apiResource('company-stats', AdminCompanyStatController::class)->except(['show'])->parameters(['company-stats' => 'companyStat'])->names('admin.company-stats');
        Route::put('sections/{key}', [AdminSectionController::class, 'update'])->name('admin.sections.update');
    });
});
