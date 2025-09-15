## Git Branching + Pull Request Strategy
A consistent Git strategy helps us collaborate cleanly, track progress efficiently, and ensure high-quality code makes its way into production. This section outlines our approach to branching, committing, and submitting pull requests.

### Branch Naming Convention
All branches must be named using the following format:
ClickUpID: Short general task description (4–5 words)
Use kebab-case for the description.
Keep it concise and relevant to the overarching task.
This ensures traceability between the code and ClickUp task.

E.g. git checkout -b 86cyegvdb-add-user-profile-button

### Commit message convention 
ClickUpID: Specific work completed in this commit
Be more specific than the branch name.
Use the imperative mood (e.g., Add, Refactor, Fix, Implement).
Keep each commit focused on a single concern (atomic commits).

E.g. git commit -m "86cyegvdb: Add CSS and Tailwind for the button visuals"

### Pull Request Naming Convention

Pull requests should also use this format:
ClickUpID: General description of task (same or similar to branch name)
It’s okay for the description to be slightly longer than the branch name
Use an imperative mood.
Make sure it is clear what this PR introduces or changes.
Example: 86cyegvdb: Add new user profile button
Branching Strategy
We follow a feature-branch workflow: 
Always base your work off the latest main 
Push your branch regularly 
Open a PR targeting main
Get a code review
Merge your PR once approved and passing the automatically run tests
Delete your branch when merged
Keeping your branch up to date
Before merging, ensure your feature branch is up to date with main to avoid conflicts:
Run the following commands to do that
Git checkout main
Git pull 
Git checkout your-branch-name
Git merge main

### Git Policies (Extended)
1. All PRs Require at least 1 reviewer
Every PR must be reviewed and approved by at least one other team member before merging.
The reviewer should be familiar with the area of code being modified.
Self-approval or merging without review is not permitted.
2. Do Not Resolve your own comments in a PR
Only the team member who left the comment should resolve it.
This ensures the original reviewer has confirmed the feedback was addressed.
If you disagree with a comment, reply to it respectfully and provide reasoning rather than resolving it unilaterally.
3. Include a screenshot of the changes you made in the PR
Add a visual proof of functionality in the PR description.
For UI work, include a screenshot or short video of the component/page in action.
For backend or logic changes, include test output or logs to demonstrate successful execution.
4. Test after resolving 
Always re-test the application after resolving merge conflicts.
Ensure all relevant parts of the app still function as expected.
Merging does not guarantee functionality — manual validation is critical.
5. Leave informed and constructive feedback when reviewing
Review thoroughly and provide specific, thoughtful feedback.
Explain your reasoning behind suggestions or requested changes.
Be clear, respectful, and collaborative in your tone.
If the PR is solid, affirm that with a positive comment (e.g., "Looks good to me!").

