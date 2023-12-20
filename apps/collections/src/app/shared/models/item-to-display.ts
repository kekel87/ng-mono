export interface ItemToDisplay {
  id: string;
  predicate: string;
  title: string;
  subTitle: string;
  image: string | null;
  acquired?: boolean;
}
