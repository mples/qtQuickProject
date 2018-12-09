import QtQuick 2.9
import QtQuick.Window 2.2


Item {
    property string imagePath: ""
    property int boardRow: 0
    property int boardColumn: 0
    property int boardSize: 0
    property var clickFunc: null
    property string side: ""
    property string type: ""
    property var moves: null
    property bool notmoved: true
    width:height
    x: boardColumn * boardSize
    y: boardRow * boardSize
    Image {
        id: name
        source: imagePath
        anchors.fill: parent
        fillMode: Image.PreserveAspectFit
        sourceSize.height: parent.height
        sourceSize.width: parent.width
    }
    MouseArea {
        anchors.fill: parent
        id: mouseArea
        onClicked: clickFunc()
    }

}
