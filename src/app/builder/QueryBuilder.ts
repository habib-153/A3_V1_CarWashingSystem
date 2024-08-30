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
        const searchDate = this?.query?.searchDate
        console.log(searchDate)
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
        const excludeFields = ['searchTerm', 'sort', 'page', 'limit', 'fields'];
        excludeFields.forEach((el) => delete queryObj[el]);
        
        if(queryObj.serviceId){
            this.modelQuery = this.modelQuery.find({service: queryObj?.serviceId} as FilterQuery<T>)
        }
        if(queryObj.date){
            this.modelQuery = this.modelQuery.find({date: queryObj?.date} as FilterQuery<T>)
        }
        
        if (queryObj.filters) {
            const filters = (queryObj.filters as string).split(',')

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
        const limit = Number(this?.query?.limit) || 10
        const skip = (page - 1) * limit

        this.modelQuery = this.modelQuery.skip(skip).limit(limit)

        return this
    }

    fields(){
        const fields = (this?.query?.fields as string)?.split(',')?.join(' ') || '-__v'
        this.modelQuery = this.modelQuery.select(fields)

        return this
    }

    async countTotal(){
        const totalQueries = this.modelQuery.getFilter()
        const total = await this.modelQuery.model.countDocuments(totalQueries)
        const page = Number(this?.query?.page) || 1
        const limit = Number(this?.query?.limit) || 10
        const totalPage = Math.ceil(total / limit)
        return {
            total,
            page,
            limit,
            totalPage
        }
    }
}

export default QueryBuilder