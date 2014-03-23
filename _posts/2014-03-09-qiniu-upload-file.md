---
layout: post
title: 七牛抓取远程图片
---

七牛有获取远程资源的 [API](http://developer.qiniu.com/docs/v6/api/reference/rs/fetch.html)，
可以把远程抓取的图片直接传到七牛服务器，在类似商品分享的程序上，可以大大减缓服务器压力。

上传远程图片需要二个步骤，首先 用自己的 access_key 和 secret_key 换取 access_token, 
然后用 POST 的方式向七牛的服务器发出请求，在请求的 header 加入 access_token, data 里放入编码后的
图片 url 地址, 全部代码如下。



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
    $to = urlsafe_base64_encode('七牛空间名:目标图片.jpg'); 

    $url  = 'http://iovip.qbox.me/fetch/'. $fetch .'/to/' . $to; // 上传远程图片api地址

    $access_token = generate_access_token($access_key, $secret_key, $url); 

    $header[] = 'Content-Type: application/json';
    $header[] = 'Authorization: QBox '. $access_token;

    $con = send($url, $header);
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

