/* eslint-disable react/prop-types */
import { useParams } from 'react-router-dom';
import PublicationDetailsById from './PublicationDetailsById';

const PublicationDetails = ({ entries, config }) => {
  const { id } = useParams();

  return <PublicationDetailsById entries={entries} id={id} config={config} />;
};

export default PublicationDetails;
