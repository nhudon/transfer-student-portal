import {FormatBold} from "@mui/icons-material";
import Box from "@mui/material/Box";

const completedCoursesHelpText = "This page contains all elements of your academic transcript. \n\n No action is required on this page.";
const currentCoursesHelpText = "On this page, we'd like to gather information regarding the courses you're currently enrolled in that are relevant to your major. " +
    "Sonoma State University currently has no knowledge of these courses as they do not yet appear on your transcript. \n\n" +
    "Details we require are: the academic institution, the catalog number of the course, the subject, title, and unit count. \n\n" +
    "Once you've added your courses, review your entry for accuracy and continue to the next step once you're satisfied.";

const additionalMajorCoursesHelpText = "There are courses that appear on your transcript that have not been matched to a course at Sonoma State University \n\n" +
"If one of the courses in the list are related to your major, click the checkbox. If none of the courses are related to your major, click \"NONE APPLY\" and continue " +
    "to the next step. \n";

const correspondingCoursesHelpText =  "This page displays the list of courses you've provided to us in the previous steps. \n\n"
+ "By clicking the dropdown arrow on each course, you will be presented with a list of lower division courses from your major that they might correspond to. \n\n" +
"The \"SEE DESCRIPTION\" button will present a course catalog description of the corresponding Sonoma State University course. If the SSU course seems like a good match," +
    " click \"MATCH\". You can also undo this action by opening the catalog description again and clicking \"UNMATCH\". \n\n"
+ "Once you've decided on a matching course, you should upload either a URL or PDF to your course's syllabus so that the advisor can review the matching and decide if it's a good fit. \n\n"
+ "If you would like to provide additional information that might help your advisor make their decision, you can submit a note with this matching by clicking \"ADD NOTE\". \n\n" +
    "Once you are satisfied with your matching, you may continue to the next step.";

const eligibleCoursesHelpText = <p>These are the courses you're eligible to take next semester, as determined both by courses found on your transcript   
    and those that you've matched (if any) to SSU courses on the previous step.
    <br/><br/>
    On this page, you can rank your courses based on which of these you'd most like to take next semester. To see which courses contributed to this eligibility, click the arrow on the corresponding course entry.
    <br/><br/>
    <Box sx={{borderStyle: 'solid'}}>
        <p sx={{margin: 2}}><strong>Important:</strong> Based on your advisor's reviewal of courses you provided yourself, your course eligibility might change.
    If that's the case, you will receive an email indicating changes have been made. <br/><br/> If your course eligibility changes, you will be able to adjust this ranking.</p>
    </Box></p>;
const reviewCoursesHelpText = `This page contains the information you've submitted so far. Ensure that the courses you've matched, syllabus (or syllabi) provided, and notes are correct to the best of your knowledge.` +
    `\n \n Once you click "Finish" on the sidebar, you will not be able to edit the information mentioned above without your advisor's approval. However, you will be able to edit your course rankings as you await your advisor's review.`
    const lockScreenHelpText = `Thank you for your submission.` +  `
    \nOn this screen, you can check the status of your advisor's evaluation of your course matchings. You will receive an email when your advisor has completed their review. \n\n` +
        `In the meantime, you are free to change your preference rankings of courses you'd like to take next semester.`
        + `However, be mindful that your course eligibility may change once your case has been reviewed.` +
        `\n\n If you feel as though `

export {completedCoursesHelpText, currentCoursesHelpText, additionalMajorCoursesHelpText, eligibleCoursesHelpText, correspondingCoursesHelpText, reviewCoursesHelpText, lockScreenHelpText};