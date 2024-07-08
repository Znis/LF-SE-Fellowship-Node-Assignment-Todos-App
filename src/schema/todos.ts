import joi from "joi";

const todosSchema = joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        completed: joi.boolean().required(),
        dueDate: joi.string().required(),
        priority: joi.string().valid("High", "Medium", "Low").required(),
        category: joi.string().required()
});

export default todosSchema;