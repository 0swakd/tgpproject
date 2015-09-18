<?php

namespace Tgp\MapBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use FOS\UserBundle\Model\UserInterface;
use Tgp\MapBundle\Entity\Place;

class LocationsController extends Controller
{
    public function addAction($name, $lat, $lng)
    {
        $user = $this->getUser();

        $response = new JsonResponse();

        if (!is_object($user) || !($user instanceof UserInterface)) {
            $response->setData(array("error" => "not connected"));
            return $response;
        }

        $place = new Place();

        $place->setName($name);
        $place->setLatitude($lat);
        $place->setLongitude($lng);
        $place->addUser($user);
        $user->addPlace($place);

        $em = $this->getDoctrine()->getManager();
        $em->persist($user);
        $em->persist($place);
        $em->flush();

        $response->setData(array("ok" => "created"));

        return $response;
    }

    public function removeAction($name, $lat, $lng)
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

    public function listAction() 
    {
        $response = new JsonResponse();

        $user = $this->getUser();

        if (!is_object($user) || !($user instanceof UserInterface)) {
            $response->setData(array("error" => "not connected"));
            return $response;
        }

        $places = $user->getPlaces();

        foreach($places as $key => $place) {
            $arr[$place->getId()] = array("name" => $place->getName(),
                                            "lat" => $place->getLatitude(),
                                            "lng" => $place->getLongitude()
                                        );
      }

        $response->setData($arr);

        return $response;
    }
}

