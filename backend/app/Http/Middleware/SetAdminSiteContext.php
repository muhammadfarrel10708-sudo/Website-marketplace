<?php

namespace App\Http\Middleware;

use App\Support\SiteContext;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetAdminSiteContext
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        $siteKey = $user?->site_key ?? ($user?->username === 'nusatron' ? SiteContext::NUSATRON : SiteContext::DZIKROUND);
        SiteContext::set($siteKey);
        return $next($request);
    }
}
