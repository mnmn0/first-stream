import {MainTabs} from '../../_components/MainTabs';

export default function PersonPage({
                                     params,
                                   }: { params: Promise<{ userId: string }> }) {
  return <MainTabs params={params}/>;
}
