// TODO Debug用の変数
//var debug = true;
var debug = false;

// ホスト名
var host = "";
if (debug) {
  host = "http://www35385u.sakura.ne.jp";
} else {
  host = "http://localhost:8080"
}

// サブドメイン
var sub_domain = "/jiryokusen";

// venuesデータのURL
var url_venues = "http://www35385u.sakura.ne.jp" + sub_domain + "/venues?"

// XMLHttpRequestのオブジェクトを入れる
var xmlHttp;

var marker_list = new Array();

// TODO venues用のURLを編集
function get_venues_url(lat, lng){
  //var geoCenter = map.getCenter();
  var params = new Array();
  params.push("lat=" + lat);
  params.push("lon=" + lng);
  return url_venues + params.join("&");
}

// TODO 4sq API呼び出し＆戻り値編集
function get_venues(map, lat, lng) {
  for(var i = 0; i < marker_list.length; ++i) {
    marker_list[i].setMap(null);
  }
  
  xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = checkReadyState;
  xmlHttp.open("GET", get_venues_url(lat, lng), false);
  xmlHttp.send(null);

  function checkReadyState() {
    if((xmlHttp.readyState == 4) && (xmlHttp.status == 200)) {
      var obj = $.parseJSON(xmlHttp.responseText)
      var venues = obj.body.venues;
      for (var i in venues) {
        var venue = venues[i];
        var name = venue.name;
        var categories = venue.categories;
        var hereNow_count = venue.hereNow.count;
        var venue_loc = venue.location;
        var venue_stats = venue.stats;
        var glatlon = new google.maps.LatLng(venue_loc.lat, venue_loc.lng);
        var icon_url = get_icon_url(categories,venue_stats);
        var myMarker = create_venue_marker(glatlon, map, name, icon_url);
        var content_text = get_content_text(name,venue_stats.checkinsCount,venue_loc.distance);
        marker_list.push(myMarker);
        attachMessage(myMarker,content_text);
      }
    }
  }
}

// マーカー作成(Venue)
function create_venue_marker(position, map, name, icon_url) {
  return new google.maps.Marker({
    position : position,
    map : map,
    title : name,
    clickable : true,
    icon : icon_url
  });
}

// icon url取得
function get_icon_url(categories,venue_stats) {
  var url = "";
  for (var i in categories) {
    var categorie = categories[i];
    // メインカテゴリーのアイコンを使う
    if (categorie.primary) {
      url = create_icon_url(categorie.icon,venue_stats);
      break;
    } else {
      continue;
    }
  }
  
  return url;
}

// チェックイン数に合わせてアイコンを作る
function create_icon_url(icon,venue_stats) {
  var checkinsCount = venue_stats.checkinsCount;
  var prefix_url = icon.prefix;
  var ext = icon.name;
  // TODO チェックイン数でアイコンの大きさを変える
  if (checkinsCount > 10000) {
    // 256pic
    return prefix_url + icon.sizes[3]+ext;
  } else if (checkinsCount > 5000) {
    // 88pic
    return prefix_url + icon.sizes[2]+ext;
  } else if (checkinsCount > 1000) {
    // 64pic
    return prefix_url + icon.sizes[1]+ext;
  } else {
    // 32pic
    return prefix_url + icon.sizes[0]+ext;
  }
}

// クリック時のメッセージ出力、バルーン関係のイベント実装
function attachMessage(marker,content_text) {
  // TODO ここまで
  // マーカーを閉じてから開く
  google.maps.event.addListener(marker, 'click', function(event) {
    if(infowindow) {
      infowindow.close();
    }
    infowindow = new google.maps.InfoWindow({
      content : content_text
    });
    infowindow.open(marker.getMap(), marker);

  });
}

// TODO バルーンの文章
function get_content_text(name,count,distance) {
  var checkins = count + " Check-ins";
  var meters = distance + " meters";
  var list = [name,checkins,meters];
  return list.join("<br />");
}
