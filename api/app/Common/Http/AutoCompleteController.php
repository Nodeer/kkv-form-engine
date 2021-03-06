<?php namespace Kkv\Common\Http;

use Illuminate\Http\Request;
use Kkv\Common\Facades\Kuti;
use Laravel\Lumen\Routing\Controller;
use Nord\Lumen\Core\App\CreatesHttpResponses;
use Nord\Lumen\Core\App\SerializesData;
use Nord\Lumen\Core\App\ValidatesData;

/**
 * Class AutoCompleteController
 * @package Kkv\Common\Http
 */
class AutoCompleteController extends Controller
{
    use CreatesHttpResponses;
    use ValidatesData;
    use SerializesData;


    /**
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function autocomplete(Request $request)
    {
        $url = $request->get('source');

        return $this->okResponse(Kuti::get($url, [], true));
    }
}
