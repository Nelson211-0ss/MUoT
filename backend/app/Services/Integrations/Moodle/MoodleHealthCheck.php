<?php

namespace App\Services\Integrations\Moodle;

use Throwable;

final class MoodleHealthCheck
{
    public function __construct(
        private MoodleApiClient $client,
    ) {}

    /**
     * @return array{ok: bool, moodle: mixed, error:string|null}
     */
    public function siteInfoSnapshot(): array
    {
        if (!$this->client->ready()) {
            return ['ok' => false, 'moodle' => null, 'error' => 'missing_configuration'];
        }

        try {
            $payload = $this->client->call('core_webservice_get_site_info');

            return [
                'ok' => true,
                'moodle' => [
                    'sitename' => is_array($payload) ? ($payload['sitename'] ?? null) : null,
                    'version' => is_array($payload) ? ($payload['version'] ?? null) : null,
                ],
                'error' => null,
            ];
        } catch (Throwable $e) {
            return ['ok' => false, 'moodle' => null, 'error' => $e->getMessage()];
        }
    }
}
