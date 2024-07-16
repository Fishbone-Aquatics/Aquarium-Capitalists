import React, { useEffect, useState } from 'react';
import { getVersion } from '../utils/version';

const VersionDisplay = () => {
  const [version, setVersion] = useState('Loading...');

  useEffect(() => {
    async function fetchVersion() {
      const version = await getVersion();
      setVersion(version);
    }
    fetchVersion();
  }, []);

  return <div className="version-display">v: {version}</div>;
};

export default VersionDisplay;
