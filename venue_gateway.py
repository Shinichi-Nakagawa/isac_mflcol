# -*- coding:utf-8 -*-
'''
version : __version__
date    : __date__

Created on 2012/4/20

Venueクライアントのクラス

@author: shinyorke
'''
import json
import foursquare
import unittest
from unittest import TestCase

class Venue(object):
    '''
    four squareから写真を探す用のクラス
    '''
    client_id='40OQEJVSRAXE5WIDAXVNBK1DY1I2L2KV3B2ARFD2VVDMG1G3'
    client_secret='TSEH325GOS0J11E4WTYJLFGWBJ10O1VIFUX2NJBMXNPRUXDJ'
    client = None

    def __init__(self):
        '''
        コンストラクタ
        input : none
        output: none
        raise : none
        '''
        self.client = foursquare.Foursquare(
                                            client_id=self.client_id,
                                            client_secret=self.client_secret
                                            )
    
    def venue_search(self,query,ll=["0.0","0.0"]):
        '''
        スポット一覧を検索
        input : ll("lat,lon"),params
        output: dict
        raise : none
        '''
        
        return self.client.venues.search(params={'ll':",".join(ll)})

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
        ret = self.venue.venue_search({},ll=("35.706029","139.664812"))
        print json.dumps(ret,encoding="utf-8",ensure_ascii=True)

if __name__ == '__main__':
    unittest.main()
    
        