import React, { useEffect } from 'react';
import { useAppSelector } from '../app/hooks';
import HealthBarBlock from './HealthBarBlock';
import _ from 'lodash'
function HealthBar () {
  const characterHealth = useAppSelector((state) => state.character.health)

  // reflects current health status of character
  useEffect(() => {
  },[])
  return (
    <div id="healthBarContainer" className="healthBarContainer">
        {_.times(characterHealth, i => <HealthBarBlock key = {i} />)}
    </div>
  );
}

export default HealthBar