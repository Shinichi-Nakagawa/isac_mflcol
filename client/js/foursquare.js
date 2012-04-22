// TODO Debug�p�̕ϐ�
//var debug = true;
var debug = false;

// �z�X�g��
var host = "";
if (debug) {
  host = "http://www35385u.sakura.ne.jp";
} else {
  host = "http://localhost:8080"
}

// �T�u�h���C��
var sub_domain = "/jiryokusen";

// venues�f�[�^��URL
var url_venues = "http://www35385u.sakura.ne.jp" + sub_domain + "/venues?"

// XMLHttpRequest�̃I�u�W�F�N�g������
var xmlHttp;

var marker_list = new Array();

// TODO venues�p��URL��ҏW
function get_venues_url(lat, lng){
  //var geoCenter = map.getCenter();
  var params = new Array();
  params.push("lat=" + lat);
  params.push("lon=" + lng);
  return url_venues + params.join("&");
}

// TODO 4sq API�Ăяo�����߂�l�ҏW
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

// �}�[�J�[�쐬(Venue)
function create_venue_marker(position, map, name, icon_url) {
  return new google.maps.Marker({
    position : position,
    map : map,
    title : name,
    clickable : true,
    icon : icon_url
  });
}

// icon url�擾
function get_icon_url(categories,venue_stats) {
  var url = "";
  for (var i in categories) {
    var categorie = categories[i];
    // ���C���J�e�S���[�̃A�C�R�����g��
    if (categorie.primary) {
      url = create_icon_url(categorie.icon,venue_stats);
      break;
    } else {
      continue;
    }
  }
  
  return url;
}

// �`�F�b�N�C�����ɍ��킹�ăA�C�R�������
function create_icon_url(icon,venue_stats) {
  var checkinsCount = venue_stats.checkinsCount;
  var prefix_url = icon.prefix;
  var ext = icon.name;
  // TODO �`�F�b�N�C�����ŃA�C�R���̑傫����ς���
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

// �N���b�N���̃��b�Z�[�W�o�́A�o���[���֌W�̃C�x���g����
function attachMessage(marker,content_text) {
  // TODO �����܂�
  // �}�[�J�[����Ă���J��
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

// TODO �o���[���̕���
function get_content_text(name,count,distance) {
  var checkins = count + " Check-ins";
  var meters = distance + " meters";
  var list = [name,checkins,meters];
  return list.join("<br />");
}
