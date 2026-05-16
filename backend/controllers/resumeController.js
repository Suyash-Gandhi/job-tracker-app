export const analyzeResume = async (req, res) => {
  try {
    const { jobDescription } = req.body;
    const resumeFile = req.file;

    if (!resumeFile) return res.status(400).json({ message: 'Resume file is required' });
    if (!jobDescription) return res.status(400).json({ message: 'Job description is required' });

    // Mock AI analysis
    const keywords = jobDescription.toLowerCase().split(/\W+/).filter(w => w.length > 4);
    const matchScore = Math.floor(Math.random() * 30) + 55; // 55–85%

    const result = {
      matchScore,
      strengths: [
        'Strong technical background aligned with role requirements',
        'Relevant project experience demonstrated',
        'Clear and concise resume formatting',
        keywords[0] ? `Experience with ${keywords[0]} mentioned` : 'Good communication skills highlighted',
      ],
      weaknesses: [
        keywords[1] ? `Missing keywords: ${keywords[1]}, ${keywords[2] || ''}` : 'Some key skills not highlighted',
        'Could add more quantifiable achievements',
        'Cover letter not included',
      ],
      suggestions: [
        'Tailor your resume summary to match the job description',
        'Add metrics to your achievements (e.g., "improved performance by 30%")',
        `Include keywords: ${keywords.slice(0, 4).join(', ')}`,
      ],
      fileName: resumeFile.originalname,
    };

    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
