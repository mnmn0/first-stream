import {MainTabs} from '../../_components/MainTabs';

export default function ProjectPage({params}: { params: Promise<{ projectId: string }> }) {
  return <MainTabs params={params}/>;
}
