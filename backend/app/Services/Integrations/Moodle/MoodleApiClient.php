<?php

namespace App\Services\Integrations\Moodle;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Thin Moodle Web Services façade.
 */
class MoodleApiClient
{
    private string $baseUrl;

    private string $token;

    private string $format;

    public function __construct(?string $baseUrl = null, ?string $token = null, string $format = 'json')
    {
        $this->baseUrl = rtrim((string) ($baseUrl ?? config('services.moodle.url', '')), '/');
        $this->token = (string) ($token ?? config('services.moodle.token', ''));
        $this->format = $format;
    }

    public function ready(): bool
    {
        return $this->baseUrl !== '' && $this->token !== '';
    }

    /** @param  array<string, mixed>  $body */
    public function call(string $function, array $body = []): mixed
    {
        if (!$this->ready()) {
            throw new MoodleIntegrationException('Moodle WS is not configured (MOODLE_BASE_URL / MOODLE_WS_TOKEN missing).');
        }

        $query = http_build_query([
            'wstoken' => $this->token,
            'wsfunction' => $function,
            'moodlewsrestformat' => $this->format,
        ]);

        $url = "{$this->baseUrl}/webservice/rest/server.php?{$query}";

        $response = Http::asForm()->timeout(45)->retry(2, 200)->acceptJson()->post($url, $body);

        if ($response->failed()) {
            Log::warning('Moodle WS fault', ['fn' => $function, 'status' => $response->status()]);
            throw new MoodleIntegrationException($response->body());
        }

        return $response->json();
    }
}
