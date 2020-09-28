import React from 'react'
import { Chart } from 'react-charts'

export default function MessagesChart() {
    const sessionDuration = 30;
    const startTime = 1015;
    const d2 = [];

    for (const x of Array(sessionDuration + 1).keys()) {
        d2.push(startTime + x);
    }
    console.log(d2);

    const d2Results = Array(sessionDuration + 1).keys();

    const data2 = React.useMemo(
        () => [
            {
                label: 'Incoming Messages',
                data: [d2, d2Results]
            }
        ]
    );

    const data3 = React.useMemo(
        () => [
            {
                label: 'Incoming Messages',
                data: [[1600815034389, 0], [1600815035000, 1], [1600815036000, 0], [1600815037000, 2], [1600815038390, 0]]
            }
        ],
        []
    );

    const data = React.useMemo(
        () => [
            {
                label: 'Incoming Messages',
                data: [[0, 0], [1, 1], [2, 0], [3, 2], [4, 0]]
            },
            {
                label: 'Messages Responded To',
                data: [[0, 0], [1, 0], [2, 0], [3, 1], [4, 0]]
            }
        ],
        []
    );

    const axes = React.useMemo(
        () => [
            { primary: true, type: 'time', position: 'bottom' },
            { type: 'linear', position: 'left' }
        ],
        []
    );

    return (
        // A react-chart hyper-responsively and continuously fills the available
        // space of its parent element automatically
        <div
            style={{
                width: '300px',
                height: '300px'
            }}
        >
            <Chart data={data3} axes={axes} />
        </div>
    )
}