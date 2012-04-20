# -*- coding:utf-8 -*-
'''
version : __version__
date    : __date__

Created on 2012/4/16

FlickerPhotos Controllerクラス

@author: shinyorke
'''
from sabani_controller import SabaniController
from flickr_gateway import Flickr

class FlickerPhotosController(SabaniController):
    '''
    Flickr PHOTOSコントローラー・クラス
    写真検索はこのクラスを使う
    [GET 引数]
    lat      : 緯度
    lon      : 経度
    '''

    def __init__(self):
        '''
        コンストラクタ
        input : none
        output: none
        raise : none
        '''
        SabaniController.__init__(self)
        self.flickr = Flickr()

    def __call__(self, environ, start_response):
        ''' WSGI アプリケーション '''
        SabaniController.__call__(self, environ, start_response)
        # リクエストメソッドを取得
        method = self.get_method(environ)

        if method == 'GET':
            # GET の場合
            # パラメーター取得
            params = self.get_parameter(environ)
            # パラメーターの必須チェック
            chk_dict = self.chk_param(params)
            # 何かしらのパラメーターエラーがあった場合
            if chk_dict.has_key(self.API_MSG_KEY):
                start_response(self.HTTP_STS_200, self.HTTP_RESPONSE_HEADER_TEXT)
                self.create_http_responce_dict(
                                               self.API_STS_NG_PARAM,
                                               chk_dict[self.API_MSG_KEY],
                                               params,
                                               None,
                                               )
                return self.json_dumps_utf8(self.ret_dict)
            # 写真を検索
            photos = self.flickr.photos_search(lat=params["lat"], lon=params["lon"])
            # 検索結果を編集
            ret_list = self.flickr.url_list(photos)
            start_response(self.HTTP_STS_200, self.HTTP_RESPONSE_HEADER_TEXT)
            self.create_http_responce_dict(
                                            self.API_STS_OK,
                                            None,
                                            ret_list,
                                            len(ret_list),
                                            )
            return self.json_dumps_utf8(self.ret_dict)
        else:
            # GET以外は501エラー扱い
            start_response(self.HTTP_STS_501, self.HTTP_RESPONSE_HEADER_TEXT)
            self.create_http_responce_dict(
                                           self.API_STS_NG_OTHER,
                                           self.API_MSG_BODY_NOT_IMPLEMENTED,
                                           {'method':method},
                                           None,
                                           )
            return self.json_dumps_utf8(self.ret_dict)
    
    def chk_param(self,params):
        '''
        GET パラメータのチェックを行う
        input : GETパラメータ(dict)
        output: dict(エラー無しは空)
        raise : none
        '''
        # チェック戻り値
        chk_dict = {}
        # GETパラメーター存在チェック
        chk_dict.update(self.chk_is_params(params,
                                           [self.HTTP_REQUEST_GET_LAT,
                                            self.HTTP_REQUEST_GET_LON,
                                            ]))
        
        return chk_dict

from wsgiref import simple_server

application = FlickerPhotosController()

if __name__ == '__main__':

    srv = simple_server.make_server('', 8080, application)

    srv.serve_forever()

    
