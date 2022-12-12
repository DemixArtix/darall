import IDish from "interfaces/IDish";
export default interface IListItem {
  id: number
  title: string
  dishes: IDish[]
}