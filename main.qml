import QtQuick 2.9
import QtQuick.Window 2.2

import "ChessGame.js" as ChessGame

Window {
    id: root
    visible: true
    width: 1200
    height: 900
    title: qsTr("Chess Game")
    color: "gray"

    Board {
        id: board
        anchors.centerIn: parent
        height: width
        width: 800
    }

    Rectangle {
        height: 50
        width: 100

        Text {
            text: "Start"
            anchors.fill: parent
            anchors.centerIn: parent
        }
        MouseArea {
            anchors.fill: parent
            onClicked: ChessGame.startNewGame()
        }
    }

}
