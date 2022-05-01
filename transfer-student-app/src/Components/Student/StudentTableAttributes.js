const completedCourseTables = [
    {
        tableName: 'Transferred Courses',
        tableAttributes: [
            {
                attributeName: 'School',
                attributeDBName: 'from_school',
                align: 'left'
            },
            {
                attributeName: 'Subject',
                attributeDBName: 'from_subject',
                align: 'left'
            },
            {
                attributeName: 'Course',
                attributeDBName: 'from_title',
                align: 'left'
            },
            {
                attributeName: 'Term',
                attributeDBName: 'from_semester',
                align: 'left'
            },
            {
                attributeName: 'Year',
                attributeDBName: 'from_year',
                align: 'left'
            },

            {
                attributeName: 'Grade',
                attributeDBName: 'from_grade',
                align: 'left'
            },
            {
                attributeName: 'Units',
                attributeDBName: 'from_units',
                align: 'left'
            },
            {
                attributeName: 'SSU Subject',
                attributeDBName: 'ssu_catalog',
                align: 'left'
            },
            {
                attributeName: 'SSU Course',
                attributeDBName: 'ssu_catalog',
                align: 'left'
            },
        ],
    },
    {
        tableName: 'CS and Math Courses',
        tableAttributes: [
            {
                attributeName: 'School',
                attributeDBName: 'from_school',
                align: 'left'
            },
            {
                attributeName: 'Subject',
                attributeDBName: 'from_subject',
                align: 'left'
            },
            {
                attributeName: 'Course',
                attributeDBName: 'from_title',
                align: 'left'
            },
            {
                attributeName: 'Term',
                attributeDBName: 'from_semester',
                align: 'left'
            },
            {
                attributeName: 'Year',
                attributeDBName: 'from_year',
                align: 'left'
            },

            {
                attributeName: 'Grade',
                attributeDBName: 'from_grade',
                align: 'left'
            },
            {
                attributeName: 'Units',
                attributeDBName: 'from_units',
                align: 'left'
            },
            {
                attributeName: 'SSU Subject',
                attributeDBName: 'ssu_subject',
                align: 'left'
            },
            {
                attributeName: 'SSU Course',
                attributeDBName: 'ssu_catalog',
                align: 'left'
            },
        ],
    },
    {
        tableName: 'SSU Courses',
        tableAttributes: [
            {
                attributeName: 'Subject',
                attributeDBName: 'subject',
                align: 'left'
            },
            {
                attributeName: 'Course',
                attributeDBName: 'catalog',
                align: 'left'
            },
            {
                attributeName: 'Title',
                attributeDBName: 'course_title_long',
                align: 'left'
            },
            {
                attributeName: 'Term',
                attributeDBName: 'term',
                align: 'left'
            },
            {
                attributeName: 'Grade',
                attributeDBName: 'grade',
                align: 'left'
            },
            {
                attributeName: 'Units',
                attributeDBName: 'units',
                align: 'left'
            },
        ],
    },

    {
        tableName: 'ARR Update Forms',
        tableAttributes: [
            {
                attributeName: 'School',
                attributeDBName: 'from_school',
                align: 'left'
            },
            {
                attributeName: 'Subject',
                attributeDBName: 'from_subject',
                align: 'left'
            },
            {
                attributeName: 'Course',
                attributeDBName: 'from_catalog',
                align: 'left'
            },
            {
                attributeName: 'Grade',
                attributeDBName: 'grade',
                align: 'left'
            },
            {
                attributeName: 'Units',
                attributeDBName: 'units',
                align: 'left'
            },
            {
                attributeName: 'SSU Subject',
                attributeDBName: 'ssu_catalog',
                align: 'left'
            },
            {
                attributeName: 'SSU Course',
                attributeDBName: 'ssu_catalog',
                align: 'left'
            },
        ],
    },
    {
        tableName: 'Test Credit Courses',
        tableAttributes: [
            {
                attributeName: 'Test',
                attributeDBName: 'test_name',
                align: 'left'
            },
            {
                attributeName: 'Course',
                attributeDBName: 'course_title',
                align: 'left'
            },
            {
                attributeName: 'Term',
                attributeDBName: 'term',
                align: 'left'
            },
            {
                attributeName: 'Units',
                attributeDBName: 'units',
                align: 'left'
            },
            {
                attributeName: 'SSU Subject',
                attributeDBName: 'ssu_catalog',
                align: 'left'
            },
            {
                attributeName: 'SSU Course',
                attributeDBName: 'ssu_catalog',
                align: 'left'
            },
        ],
    },

];

const currentCoursesTable = [
    {
        attributeName: 'School',
        attributeCourseName: 'from_school',
        align: 'left'
    },
    {
        attributeName: 'Subject',
        attributeCourseName: 'from_subject',
        align: 'left'
    },
    {
        attributeName: 'Catalog Number',
        attributeCourseName: 'from_catalog',
        align: 'left'
    },
    {
        attributeName: 'Course Title',
        attributeCourseName: 'from_title',
        align: 'left'
    },
    {
        attributeName: 'Units',
        attributeCourseName: 'from_units',
        align: 'left'
    },
];

const additionalCoursesTableAttributes = [
    {
        attributeName: 'School',
        attributeDBName: 'from_school',
        align: 'left'
    },
    {
        attributeName: 'Subject',
        attributeDBName: 'from_subject',
        align: 'left'
    },
    {
        attributeName: 'Catalog Number',
        attributeDBName: 'from_catalog',
        align: 'left'
    },
    {
        attributeName: 'Course',
        attributeDBName: 'from_title',
        align: 'left'
    },
    {
        attributeName: 'Term',
        attributeDBName: 'from_semester',
        align: 'left'
    },
    {
        attributeName: 'Year',
        attributeDBName: 'from_year',
        align: 'left'
    },

    {
        attributeName: 'Grade',
        attributeDBName: 'from_grade',
        align: 'left'
    },
    {
        attributeName: 'Units',
        attributeDBName: 'from_units',
        align: 'left'
    },
]

const correspondingStudentCoursesTableAttributes = [
    {
        attributeName: 'Subject',
        attributeDBName: 'from_subject',
        align: 'left'
    },
    {
        attributeName: 'Catalog Number',
        attributeDBName: 'from_catalog',
        align: 'left'
    },
    {
        attributeName: 'Course',
        attributeDBName: 'from_title',
        align: 'left'
    },
    {
        attributeName: 'Grade',
        attributeDBName: 'from_grade',
        align: 'left'
    },
    {
        attributeName: 'Units',
        attributeDBName: 'from_units',
        align: 'left'
    },
]

const catalogTableAttributes = [
    {
        attributeName: 'Subject',
        attributeDBName: 'subject',
        align: 'left'
    },
    {
        attributeName: 'Catalog Number',
        attributeDBName: 'catalog',
        align: 'left'
    },
    {
        attributeName: 'Course',
        attributeDBName: 'course_title_long',
        align: 'left'
    },

]


export {completedCourseTables, currentCoursesTable, additionalCoursesTableAttributes,
    correspondingStudentCoursesTableAttributes, catalogTableAttributes};