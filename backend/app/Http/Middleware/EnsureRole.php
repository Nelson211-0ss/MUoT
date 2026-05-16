<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureRole
{
    /**
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  ...$roleTokens
     */
    public function handle(Request $request, Closure $next, string ...$roleTokens): Response
    {
        $user = $request->user();
        if (!$user) {
            abort(401);
        }

        $slugs = [];
        foreach ($roleTokens as $token) {
            foreach (preg_split('/[|,]/', $token, -1, PREG_SPLIT_NO_EMPTY) as $slug) {
                $slug = trim($slug);
                if ($slug !== '') {
                    $slugs[] = $slug;
                }
            }
        }

        $slugs = array_values(array_unique($slugs));
        if ($slugs === []) {
            abort(500, 'EnsureRole middleware was registered without roles.');
        }

        $allowed = $user->roles()->whereIn('slug', $slugs)->exists();
        if (!$allowed) {
            abort(403, 'Insufficient role scope.');
        }

        return $next($request);
    }
}
