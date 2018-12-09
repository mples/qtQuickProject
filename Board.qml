import QtQuick 2.9
import QtQuick.Window 2.2

Rectangle {
    property alias cellSize: grid.cellHeight
    property string movingSide: "white"
    property color oddColor: "darkblue"
    property color evenColor: "white"

    id: board
    scale:Math.min( parent.width/width, parent.height/height)
    Grid {
        id:grid
        rows: 8
        columns: rows
        anchors.fill: parent
        anchors.centerIn: parent
        property int cellHeight: height/8
        Repeater{
            model: grid.rows * grid.columns
            Rectangle {
                height: grid.cellHeight
                width: height
                property color baseColor : (index + Math.floor(index/8))% 2 ? oddColor : evenColor
                color: baseColor
                anchors.alignWhenCentered: parent
                MouseArea{
                    anchors.fill: parent
                    onPressed: {
                        parent.color = "lightgray"
                    }
                    onReleased: {
                        parent.color = parent.baseColor
                    }
                    
                }
            }
        }
    }
}
