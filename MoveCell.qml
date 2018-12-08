import QtQuick 2.9
import QtQuick.Window 2.2

Rectangle {
    property int boardRow: 0
    property int boardColumn: 0
    property int boardSize: 0
    property var clickFunc: null
    property var figureToMove: null

    height: boardSize
    width: height
    x: boardColumn * boardSize
    y: boardRow * boardSize
    color: "transparent"
    border.color: "darkred"
    border.width: boardSize/10

    MouseArea {
        anchors.fill: parent
        id: mouseArea
        onClicked: clickFunc()
    }

}
