<?php

namespace Tgp\MapBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use FOS\UserBundle\Model\UserInterface;
use Tgp\MapBundle\Entity\Place;

class GetFriendsPlaceListController extends Controller 
{
    public function getAction() 
    {
        $response = new JsonResponse();

        $user = $this->getUser();

        if (!is_object($user) || !($user instanceof UserInterface)) {
            $response->setData(array("error" => "not connected"));
            return $response;
        }

        $friends = $user->getMyFriends();

        foreach($friends as $key => $friend) {
            $places = $friend->getPlaces();

            $tmp = [];
            foreach($places as $key => $place) {
                $tmp[$place->getId()] = array("name" => $place->getName(),
                                                "lat" => $place->getLatitude(),
                                                "lng" => $place->getLongitude()
                                            );
            }
            $arr[$friend->getId()] = array("name" => $friend->getUsername(), "id" => $friend->getId(), "places" => $tmp);
        }

        if (count($arr) == 0) {
            $response->setData(array("error" => "Friends Not Found"));
            return $response;
        }


        $response->setData($arr);

        return $response;
    }
}

