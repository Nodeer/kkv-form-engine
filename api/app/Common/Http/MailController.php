<?php namespace Kkv\Common\Http;

use Illuminate\Http\Request;
use Illuminate\Mail\Message;
use Illuminate\Support\Facades\Mail;
use Laravel\Lumen\Routing\Controller;
use Nord\Lumen\Core\App\CreatesHttpResponses;
use Nord\Lumen\Core\App\SerializesData;
use Nord\Lumen\Core\App\ValidatesData;

/**
 * Class MailController
 * @package Kkv\Common\Http
 */
class MailController extends Controller
{
    use CreatesHttpResponses;
    use ValidatesData;
    use SerializesData;


    /**
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function sendMail(Request $request)
    {
        $this->tryValidateData($request->all(), [
            'message'           => 'required',
        ], function ($errors) {
            $this->throwValidationFailed('ERROR.VALIDATION_FAILED', $errors);
        });

        // todo: figure out these parameters.
        $data = [
            'subject' => '',
            'body' => $request->get('message'),
            'to' => '',
            'toName' => '',
        ];

        $result = Mail::send('message', $data, function ($message) use ($data) {
            /** @var Message $message */
            $message->subject($data['subject']);
            $message->to($data['to'], $data['toName']);
        });

        if ($result > 0 ) {
            return $this->okResponse();
        } else {
            return $this->errorResponse('ERROR.COULD_NOT_SEND_EMAIL');
        }
    }
}
