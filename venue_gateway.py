# -*- coding:utf-8 -*-
'''
version : __version__
date    : __date__

Created on 2012/4/20

Venueクライアントのクラス

@author: shinyorke
'''

import unittest
from unittest import TestCase

class Venue(object):
    '''
    four squareから写真を探す用のクラス
    '''
    # TODO

    def __init__(self):
        '''
        コンストラクタ
        input : none
        output: none
        raise : none
        '''
        pass
    
    def venue_search(self,hoge):
        '''
        スポット一覧を検索
        # TODO 引数は暫定
        input : hoge
        output: dict
        raise : none
        '''
        # TODO
        ret = {}
        return ret

class TestVenue(TestCase):
    
    venue = None
    #setUpは、テストメソッド実行毎に事前に実行される
    def setUp(self):
        print 'setUp'
        
    def tearDown(self):
        print 'tearDown'
    
    def test_venue_search(self):
        # TODO
        self.venue = Venue()
        hoge = ""
        self.venue.venue_search(hoge)

if __name__ == '__main__':
    unittest.main()
    
        