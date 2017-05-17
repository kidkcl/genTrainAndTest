import React from 'react';

function ShuffleData(props) {
    console.log(props.data);
    return (
        <div>
            {JSON.stringify(props.data, null)}
        </div>
    );
}

export default ShuffleData;