import React from 'react'
import { Button } from 'antd'
import { PhoneOutlined } from '@ant-design/icons';

const VoiceButton = () => {
    return ( <div>
        <Button size="large" type="primary"><PhoneOutlined style={{ fontSize: '24px',  }} /></Button>
    </div> );
}
 
export default VoiceButton;