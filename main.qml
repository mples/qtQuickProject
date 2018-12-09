import QtQuick 2.9
import QtQuick.Window 2.2
import QtQuick.Controls 2.4
import QtQuick.Dialogs 1.3

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
        anchors.leftMargin: 100
        height: width
        width: 800
    }
    Column {
        anchors { left: parent.left; verticalCenter: parent.verticalCenter}
        padding: 10
        spacing: 10

        Button {
            text: "New Game"
            onClicked: ChessGame.startNewGame()
            width: 100
            height: 40
        }

        Button {
            text: "Odd Color"
            onClicked: oddColorDialog.open()
            width: 100
            height: 40


        }
        Button {
            text: "Even Color"
            onClicked: evenColorDialog.open()
            width: 100
            height: 40

        }

    }

    ColorDialog {
        id: evenColorDialog
        title: "Please choose a color"
        onAccepted: {
            board.oddColor = evenColorDialog.color
        }
    }

    ColorDialog {
        id: oddColorDialog
        title: "Please choose a color"
        onAccepted: {
            board.evenColor = oddColorDialog.color
        }
    }

    MessageDialog {
        property string winningSide: ""

        id: winDialog
        title: "Chekmate"
        text: winningSide + " side won!"
        onAccepted: {
            ChessGame.clearFiguresArray();
        }
    }

    MessageDialog {
        id: darwDialog
        title: "Draw"
        text: "Game ended with a draw!"
        onAccepted: {
            ChessGame.clearFiguresArray();
        }
    }

/*
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
    }*/

}
