import React from 'react';
import { components } from 'react-select';

const CustomOption = (props) => {
    const { data, innerRef, innerProps } = props;
    return (
        <components.Option {...props} innerRef={innerRef} innerProps={innerProps}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                    <strong>{data.label}</strong>
                </div>
            </div>
        </components.Option>
    );
};

export default CustomOption;