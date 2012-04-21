// TODO Debug用の変数
var debug = true;
//var debug = false;

// ホスト名
var host = "";
if (debug) {
	host = "http://www35385u.sakura.ne.jp";
} else {
	host = "http://localhost:8080"
}

// サブドメイン
var sub_domain = "/jiryokusen";

// geoデータのURL
var url_geo = host + sub_domain + "/geo?"

// venuesデータのURL
var url_venues = host + sub_domain + "/venues?"

// photosデータのURL
var url_photos = host + sub_domain + "/photos?"

// XMLHttpRequestのオブジェクトを入れる
var xmlHttp;

// GEOデータ用のURLを編集
function get_geo_url(map){
	var zoom = map.getZoom();
	var bounds = map.getBounds();
	var swLatlng = bounds.getSouthWest();
	var neLatlng = bounds.getNorthEast();
	var params = new Array();
	params.push("zoom=" + zoom);
	params.push("swlat=" + swLatlng.lat());
	params.push("swlon=" + swLatlng.lng());
	params.push("nelat=" + neLatlng.lat());
	params.push("nelon=" + neLatlng.lng());
	return url_geo + params.join("&");
}

// GEOデータ取得
function get_geo() {
	xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = set_markers;
	xmlHttp.open("GET", get_geo_url(map), false);
	xmlHttp.send(null);
	function set_markers() {
		if((xmlHttp.readyState == 4) && (xmlHttp.status == 200)) {
			// TODO 戻り値を編集＆マップに格納
			//alert("test");
			var obj = $.parseJSON(xmlHttp.responseText)
			for (var i in obj.body) {
				row = obj.body[i];
				name = row.name;
				latlon = row.location;
				var glatlon = new google.maps.LatLng(latlon.lat, latlon.lon);
				create_marker(glatlon, map)
			}
		}
	}
}

// TODO venues用のURLを編集
function get_venues_url(geoCenter){
	var zoom = map.getZoom();
	var params = new Array();
	params.push("zoom=" + zoom);
	params.push("lat=" + geoCenter.lat());
	params.push("lon=" + geoCenter.lng());
	return url_venues + params.join("&");
}

// TODO 4sq API呼び出し＆戻り値編集
function get_venues(latlon) {
	xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = checkReadyState;
	xmlHttp.open("GET", get_venues_url(latlon), false);
	xmlHttp.send(null);

	function checkReadyState() {
		if((xmlHttp.readyState == 4) && (xmlHttp.status == 200)) {
			// TODO 戻り値を編集＆マップに格納
		}
	}
}

// TODO photos用のURLを編集
function get_photos_url(geoCenter){
	var zoom = map.getZoom();
	var params = new Array();
	params.push("zoom=" + zoom);
	params.push("lat=" + geoCenter.lat());
	params.push("lon=" + geoCenter.lng());
	return url_photos + params.join("&");
}

// TODO Flickr API呼び出し＆戻り値編集
function get_photos(latlon) {
	xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = checkReadyState;
	xmlHttp.open("GET", get_photos_url(latlon), false);
	xmlHttp.send(null);

	function checkReadyState() {
		if((xmlHttp.readyState == 4) && (xmlHttp.status == 200)) {
			// TODO 戻り値を編集＆マップに格納
		}
	}
}