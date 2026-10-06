<?php

namespace App\Http\Middleware;

use App\Support\SiteContext;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetPublicSiteContext
{
    public function handle(Request $request, Closure $next): Response
    {
        SiteContext::set($request->header('X-Site-Key', SiteContext::DZIKROUND));
        return $next($request);
    }
}
