<?php namespace Kkv\Slides\App;

use Illuminate\Support\Collection;
use Kkv\Slides\Domain\Model\Slide;
use Kkv\Slides\Infrastructure\SlideRepository;
use Nord\Lumen\Core\App\CreatesIdentities;
use Nord\Lumen\Core\App\ManagesEntities;

class SlideService
{

    use ManagesEntities;
    use CreatesIdentities;


    /**
     * @param string|null $name
     * @param string|null $label
     * @param string|null $summaryLabel
     * @param array       $elements
     * @param array       $style
     * @param int         $saveAfter
     * @param int         $summaryAfter
     * @param int         $excludeFromSummary
     * @param int|null    $orderNumber
     *
     * @return Slide
     * @throws \Nord\Lumen\Core\Exception\FatalError
     */
    public function createSlide(
        $name = null,
        $label = null,
        $summaryLabel = null,
        array $elements = [],
        array $style = [],
        $saveAfter,
        $summaryAfter,
        $excludeFromSummary,
        $orderNumber = null
    ) {

        $objectId = $this->createObjectId(function ($value) {
            return $this->getRepository()->objectIdExists($value);
        });

        $slide = new Slide($objectId, $name, $label, $summaryLabel, $elements, $style, $saveAfter, $summaryAfter,
            $excludeFromSummary, $orderNumber);

        $this->saveEntityAndCommit($slide);

        return $slide;
    }


    /**
     * @param Slide       $slide
     * @param string|null $name
     * @param string|null $label
     * @param string|null $summaryLabel
     * @param array       $elements
     * @param array       $style
     * @param int         $saveAfter
     * @param int         $summaryAfter
     * @param int         $excludeFromSummary
     * @param int|null    $orderNumber
     */
    public function updateSlide(
        Slide $slide,
        $name = null,
        $label = null,
        $summaryLabel = null,
        array $elements = [],
        array $style = [],
        $saveAfter,
        $summaryAfter,
        $excludeFromSummary,
        $orderNumber = null
    ) {
        if ($slide->getName() !== $name) {
            $slide->changeName($name);
        }
        if ($slide->getLabel() !== $label) {
            $slide->changeLabel($label);
        }
        if ($slide->getSummaryLabel() !== $summaryLabel) {
            $slide->changeSummaryLabel($summaryLabel);
        }
        if ($slide->getElements() !== $elements) {
            $slide->changeElements($elements);
        }
        if ($slide->getStyle() !== $style) {
            $slide->changeStyle($style);
        }
        if ($slide->getSaveAfter() !== $saveAfter) {
            $slide->changeSaveAfter($saveAfter);
        }
        if ($slide->getSummaryAfter() !== $summaryAfter) {
            $slide->changeSummaryAfter($summaryAfter);
        }
        if ($slide->getExcludeFromSummary() !== $excludeFromSummary) {
            $slide->changeExcludeFromSummary($excludeFromSummary);
        }
        if ($slide->getOrderNumber() !== $orderNumber) {
            $slide->changeOrderNumber($orderNumber);
        }

        $this->updateEntityAndCommit($slide);
    }


    /**
     * @param Slide $slide
     */
    public function deleteSlide(Slide $slide)
    {
        $this->deleteEntityAndCommit($slide);
    }


    /**
     * @param string $id
     *
     * @return Slide|null
     */
    public function getSlide($id)
    {
        return $this->getRepository()->findByObjectId($id);
    }


    /**
     * @return Collection
     */
    public function getSlides()
    {
        return new Collection($this->getRepository()->findAll());
    }


    /**
     * @return SlideRepository
     */
    private function getRepository()
    {
        return $this->getEntityRepository(Slide::class);
    }
}
