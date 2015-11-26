<?php

namespace Tgp\MapBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use FOS\UserBundle\Model\UserInterface;
use Tgp\MapBundle\Entity\Place;

class GetFriendPlaceListController extends Controller 
{
    public function getAction($id, $name) 
    {
        $response = new JsonResponse();

        $user = $this->getUser();

        if (!is_object($user) || !($user instanceof UserInterface)) {
            $response->setData(array("error" => "not connected"));
            return $response;
        }

        $friends = $user->getMyFriends();

        foreach($friends as $key => $friend) {
            if ($friend->getId() != $id || $friend->getUsername() != $name) {
                continue;
            }

            $places = $friend->getPlaces();

            foreach($places as $key => $place) {
                $tmp[$place->getId()] = array("name" => $place->getName(),
                                                "lat" => $place->getLatitude(),
                                                "lng" => $place->getLongitude(),
                                                "contactid" => $friend->getId()
                                            );
            }

            $arr[$friend->getId()] = array("name" => $friend->getUsername(), "id" => $friend->getId(), "places" => $tmp);
        }

        if (count($arr) == 0) {
            $response->setData(array("error" => "Friend Not Found"));
            return $response;
        }

        $response->setData($arr);

        return $response;
    }
}

