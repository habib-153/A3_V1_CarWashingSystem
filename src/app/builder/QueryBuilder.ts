import { FilterQuery, Query } from "mongoose";

class QueryBuilder<T>{
    public modelQuery: Query<T[], T>
    public query: Record<string, unknown>

    constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>){
        this.modelQuery = modelQuery
        this.query = query
    }

    search(searchableFields: string[]){
        const searchTerm =  this?.query?.searchTerm
        if(searchTerm){
            this.modelQuery = this.modelQuery.find({
                $or: searchableFields.map(field => ({
                    [field]: {
                        $regex: searchTerm, $options: 'i'
                    }
                }) as FilterQuery<T>)
            })
        }
        return this
    }

    filter(){
        const queryObj = { ...this.query }
        //filtering
        const excludeFields = ['searchTerm', 'sort', 'page', 'limit', 'fields', 'date'];
        excludeFields.forEach((el) => delete queryObj[el]);
        
        if(queryObj.serviceId){
            this.modelQuery = this.modelQuery.find({service: queryObj?.serviceId} as FilterQuery<T>)
        }
        //console.log(queryObj)
        if (queryObj.filters) {
            // console.log(queryObj.filters)
            const filters = (queryObj.filters as string).split(',')
            // console.log(filters)

            filters?.forEach((str: string) => {
                const [key, value] = str.split(' ');
                if (key === 'less' && value === 'than') {
                    const duration = parseInt(str.split(' ')[2], 10);
                    if (!isNaN(duration)) {
                        // console.log(duration)
                        this.modelQuery = this.modelQuery.find({ duration: { $lte: duration } } as FilterQuery<T>);
                    }
                }
                if (key === 'more' && value === 'than') {
                    const duration = parseInt(str.split(' ')[2], 10);
                    if (!isNaN(duration)) {
                        this.modelQuery = this.modelQuery.find({ duration: { $gt: duration } } as FilterQuery<T>);
                    }
                }
            })
            // queryObj.filters?.forEach((filter: string) => {
                // const [key, value] = filter.split(' ');
                // if (key === 'less' && value === 'than') {
                //     const duration = parseInt(filter.split(' ')[2], 10);
                //     if (!isNaN(duration)) {
                //         this.modelQuery = this.modelQuery.find({ duration: { $lt: duration } } as FilterQuery<T>);
                //     }
                // }
            // });
        }
        //console.log(this.modelQuery)
        return this
    }

    sort(){
        const sort = (this?.query?.sort as string)?.split(',')?.join(' ') || '-createdAt'
        this.modelQuery = this.modelQuery.sort(sort as string)

        return this
    }

    paginate(){
        const page = Number(this?.query?.page) || 1
        const limit = Number(this?.query?.limit) || 5
        const skip = (page - 1) * limit

        this.modelQuery = this.modelQuery.skip(skip).limit(limit)

        return this
    }

    fields(){
        const fields = (this?.query?.fields as string)?.split(',')?.join(' ') || '-__v'
        this.modelQuery = this.modelQuery.select(fields)

        return this
    }
}

export default QueryBuilder