<?php

namespace Tgp\MapBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use FOS\UserBundle\Model\UserInterface;
use Tgp\MapBundle\Entity\Place;

class PlaceController extends Controller
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

    public function searchAction($request) 
    {
        $response = new JsonResponse();
        $reqlen = strlen($request);

        if ($reqlen <= 0 || $reqlen > 32) {
            return $response;
        }
        
        $ch = curl_init();

        $req = curl_escape($ch, $request);
        $url="http://nominatim.openstreetmap.org/search/{$req}?format=json&addressdetails=1";

        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $r = curl_exec($ch);
        curl_close($ch);

        // reponse a JSON.parse();
        return new JsonResponse($r);
    }
}

