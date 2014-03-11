---
layout: post
title: 七牛抓取远程图片
---

七牛支持抓取远程图片 [API](http://developer.qiniu.com/docs/v6/api/reference/rs/fetch.html)，官方还没有SDK，自个对着手册写了一下。

代码非常简单。用 access_key + secret_key + url 生成 access_token, 把 access_token 加在 header 里，然后向 post url 就完成上传了。
安全编码和签名运算都是从官方复制的。


    /*
     *
     * @desc URL安全形式的base64编码
     * @param string $str
     * @return string
     */


    function urlsafe_base64_encode($str){
        $find = array("+","/");
        $replace = array("-", "_");
        return str_replace($find, $replace, base64_encode($str));
    }

    /**
     * generate_access_token
     *
     * @desc 签名运算
     * @param string $access_key
     * @param string $secret_key
     * @param string $url
     * @param array  $params
     * @return string
     */
    function generate_access_token($access_key, $secret_key, $url, $params = ''){
        $parsed_url = parse_url($url);
        $path = $parsed_url['path'];
        $access = $path;
        if (isset($parsed_url['query'])) {
            $access .= "?" . $parsed_url['query'];
        }
        $access .= "\n";
        if($params){
            if (is_array($params)){
                $params = http_build_query($params);
            }
            $access .= $params;
        }
        $digest = hash_hmac('sha1', $access, $secret_key, true);
        return $access_key.':'.urlsafe_base64_encode($digest);
    }

    /**
     * 测试
     */

    $access_key = '''your access_key';
    $secret_key = 'your secret_key';



    $fetch = urlsafe_base64_encode('http://203.208.46.200/images/srpr/logo11w.png');
    $to = urlsafe_base64_encode('ibeircn:11.jpg');

    $url  = 'http://iovip.qbox.me/fetch/'. $fetch .'/to/' . $to;

    $access_token = generate_access_token($access_key, $secret_key, $url);

    $header[] = 'Content-Type: application/json';
    $header[] = 'Authorization: QBox '. $access_token;


    $con = send('iovip.qbox.me/fetch/'.$fetch.'/to/'.$to, $header);
    var_dump($con);

    function send($url, $header = '') {
        $curl = curl_init($url);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($curl, CURLOPT_HEADER,1);
        curl_setopt($curl, CURLOPT_HTTPHEADER, $header);
        curl_setopt($curl, CURLOPT_POST, 1);

        $con = curl_exec($curl);

        if ($con === false) {
            echo 'CURL ERROR: ' . curl_error($curl);
        } else {
            return $con;
        }
    }
    ?>

