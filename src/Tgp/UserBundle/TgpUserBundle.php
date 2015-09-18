<?php

namespace Tgp\UserBundle;

use Symfony\Component\HttpKernel\Bundle\Bundle;

class TgpUserBundle extends Bundle
{
    public function getParent() {
        return 'FOSUserBundle';
    }
}
