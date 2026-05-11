import { saveAs } from 'file-saver';
import Papa from 'papaparse';

const exportToCSV = (candidates) => {
  const parseFeedback = (rawTranscript) => {
    let parsedTranscript = rawTranscript;
    if (typeof rawTranscript === 'string') {
      try {
        parsedTranscript = JSON.parse(rawTranscript);
      } catch (e) {
        parsedTranscript = rawTranscript;
      }
    }
    return parsedTranscript?.feedback || parsedTranscript || {};
  };

  const data = candidates.map(c => {
    const feedback = parseFeedback(c.conversation_transcript);
    return {
      Name: c.fullname || c.userName || 'Unknown',
      Email: c.email || c.useremail || '',
      Score: feedback?.overallScore || 0,
      TechnicalSkills: feedback?.rating?.TechnicalSkills || 0,
      Communication: feedback?.rating?.Communication || 0,
      ProblemSolving: feedback?.rating?.ProblemSolving || 0,
      Experience: feedback?.rating?.Experience || 0,
      Behavioral: feedback?.rating?.Behavioral || 0,
      Thinking: feedback?.rating?.Thinking || 0,
      Recommendation: feedback?.Recommendation || feedback?.recommendation || '',
      RecommendationMessage: feedback?.RecommendationMessage || feedback?.recommendationMessage || '',
      Summary: Array.isArray(feedback?.summary)
        ? feedback.summary.join('; ')
        : (feedback?.summary || ''),
    };
  });

  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, "candidates.csv");
};

export default exportToCSV;