<?php

namespace Tgp\MapBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use FOS\UserBundle\Model\UserInterface;
use Tgp\MapBundle\Entity\Place;

class RemovePlaceController extends Controller
{
    public function setAction($name, $lat, $lng)
    {
        $user = $this->getUser();

        $response = new JsonResponse();

        if (!is_object($user) || !($user instanceof UserInterface)) {
            $response->setData(array("error" => "not connected"));
            return $response;
        }

        $places = $user->getPlaces();

        $found = false;
        
        foreach ($places as $key => $place) {
            if ($place->getName() == $name
                    && $place->getLatitude() == $lat
                    && $place->getLongitude() == $lng) {
                $place->removeUser($user);
                $user->removePlace($place);
                $found = true;
                break;
            }
        }

        if ($found == true) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($user);
            $em->persist($place);
            $em->flush();

            $response->setData(array("ok" => "link deleted"));
        } else {
            $response->setData(array("error" => "not found"));
        }

        return $response;
    }
}

