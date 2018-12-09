import QtQuick 2.9
import QtQuick.Window 2.2


Item {
    id: figure_component
    property string imagePath: ""
    property int boardRow: 0
    property int boardColumn: 0
    property int boardSize: 0
    property var clickFunc: null
    property string side: ""
    property string type: ""
    property var moves: null
    property bool notmoved: true
    property alias destroyAnim: destroyAnim

    Behavior on x {
        NumberAnimation {
            id: animationx
            duration: 500
            easing.type: Easing.InBack
        }
    }
    Behavior on y {
        NumberAnimation {
            id: animationy
            duration: 500
            easing.type: Easing.InBack
        }
    }
    Behavior on opacity{
        NumberAnimation {
            duration: 300
        }
    }
    SequentialAnimation
    {
        id: destroyAnim
        ScriptAction{script: figure_component.opacity = 0}
        NumberAnimation{
            target: figure_component;
            property:"scale";
            to: 1.5
            duration: 300
        }
        ScriptAction{script: figure_component.destroy()}
    }





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
