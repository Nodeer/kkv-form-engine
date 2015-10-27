<?php namespace Kkv\Slides\Http;

use Illuminate\Http\Request;
use Kkv\Slides\App\HandlesSlides;
use Laravel\Lumen\Routing\Controller;
use Nord\Lumen\Core\App\CreatesHttpResponses;
use Nord\Lumen\Core\App\SerializesData;
use Nord\Lumen\Core\App\ValidatesData;

/**
 * Class SlideController
 * @package Kkv\Slides\Http
 */
class SlideController extends Controller
{

    use ValidatesData;
    use CreatesHttpResponses;
    use SerializesData;
    use HandlesSlides;


    /**
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function createSlide(Request $request)
    {
        $this->tryValidateData($request->all(), [
            'save_after'           => 'required|integer',
            'summary_after'        => 'required|integer',
            'exclude_from_summary' => 'required|integer',
        ], function ($errors) {
            $this->throwValidationFailed('ERROR.VALIDATION_FAILED', $errors);
        });

        $name               = $request->get('name');
        $label              = $request->get('label');
        $summaryLabel       = $request->get('summary_label');
        $elements           = $request->get('elements', []);
        $style              = $request->get('style', []);
        $saveAfter          = $request->get('save_after');
        $summaryAfter       = $request->get('summary_after');
        $excludeFromSummary = $request->get('exclude_from_summary');
        $orderNumber        = $request->get('order_number');

        $slide = $this->getSlideService()->createSlide($name, $label, $summaryLabel, $elements, $style, $saveAfter,
            $summaryAfter, $excludeFromSummary, $orderNumber);

        return $this->resourceCreatedResponse($this->serializeData($slide));
    }


    /**
     * @param Request $request
     * @param string  $id
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateSlide(Request $request, $id)
    {

        $slide = $this->tryGetSlide($id, function () {
            $this->throwNotFound('ERROR.SLIDE_NOT_FOUND');
        });

        $this->tryValidateData($request->all(), [
            'save_after'           => 'required|integer',
            'summary_after'        => 'required|integer',
            'exclude_from_summary' => 'required|integer',
        ], function ($errors) {
            $this->throwValidationFailed('ERROR.VALIDATION_FAILED', $errors);
        });

        $name               = $request->get('name');
        $label              = $request->get('label');
        $summaryLabel       = $request->get('summary_label');
        $elements           = $request->get('elements', []);
        $style              = $request->get('style', []);
        $saveAfter          = $request->get('save_after');
        $summaryAfter       = $request->get('summary_after');
        $excludeFromSummary = $request->get('exclude_from_summary');
        $orderNumber        = $request->get('order_number');

        $this->getSlideService()->updateSlide($slide, $name, $label, $summaryLabel, $elements, $style, $saveAfter,
            $summaryAfter, $excludeFromSummary, $orderNumber);

        return $this->resourceOkResponse($this->serializeData($slide));
    }


    /**
     * @param Request $request
     */
    public function updateOrder(Request $request)
    {
        // Todo: Do we need this?
    }


    /**
     * @return \Illuminate\Http\JsonResponse
     */
    public function listSlides()
    {
        $slides = $this->getSlideService()->getSlides();

        return $this->resourceOkResponse($this->serializeData($slides));
    }


    /**
     * @param string $id
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function readSlide($id)
    {
        $slide = $this->tryGetSlide($id, function () {
            $this->throwNotFound('ERROR.SLIDE_NOT_FOUND');
        });

        return $this->resourceOkResponse($this->serializeData($slide));
    }


    /**
     * @param string $id
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteSlide($id)
    {

        $slide = $this->tryGetSlide($id, function () {
            $this->throwNotFound('ERROR.SLIDE_NOT_FOUND');
        });

        $this->getSlideService()->deleteSlide($slide);

        return $this->okResponse();
    }
}
