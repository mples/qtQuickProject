import QtQuick 2.9
import QtQuick.Window 2.2

Item {
    property var imagePath: "qrc:/images/img/Chess_kdt45.svg"
    property int boardRow: 0
    property int boardColumn: 0
    property var clickFunc: null
    width:height

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
