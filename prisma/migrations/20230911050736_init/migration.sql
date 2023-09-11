BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[User] (
    [id] INT NOT NULL IDENTITY(1,1),
    [username] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [password] NVARCHAR(1000) NOT NULL,
    [role] NVARCHAR(1000) NOT NULL,
    [is_deleted] BIT NOT NULL CONSTRAINT [User_is_deleted_df] DEFAULT 0,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [User_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [User_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [User_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[Mentor] (
    [id] INT NOT NULL IDENTITY(1,1),
    [user_id] INT NOT NULL,
    [phone_number] NVARCHAR(1000),
    [resume_summary] NVARCHAR(1000),
    [work_experience] NVARCHAR(1000),
    [education] NVARCHAR(1000),
    [certificate] NVARCHAR(1000),
    [is_deleted] BIT NOT NULL CONSTRAINT [Mentor_is_deleted_df] DEFAULT 0,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [Mentor_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [Mentor_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Mentor_user_id_key] UNIQUE NONCLUSTERED ([user_id])
);

-- CreateTable
CREATE TABLE [dbo].[MentorSkills] (
    [mentor_id] INT NOT NULL,
    [skills_id] INT NOT NULL,
    [is_deleted] BIT NOT NULL CONSTRAINT [MentorSkills_is_deleted_df] DEFAULT 0,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [MentorSkills_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [MentorSkills_pkey] PRIMARY KEY CLUSTERED ([mentor_id],[skills_id])
);

-- CreateTable
CREATE TABLE [dbo].[Skills] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [is_deleted] BIT NOT NULL CONSTRAINT [Skills_is_deleted_df] DEFAULT 0,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [Skills_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [Skills_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Skills_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[Mentee] (
    [id] INT NOT NULL IDENTITY(1,1),
    [user_id] INT NOT NULL,
    [is_deleted] BIT NOT NULL CONSTRAINT [Mentee_is_deleted_df] DEFAULT 0,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [Mentee_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [Mentee_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Mentee_user_id_key] UNIQUE NONCLUSTERED ([user_id])
);

-- CreateTable
CREATE TABLE [dbo].[Request] (
    [id] INT NOT NULL IDENTITY(1,1),
    [mentor_id] INT NOT NULL,
    [mentee_id] INT NOT NULL,
    [approved] BIT NOT NULL CONSTRAINT [Request_approved_df] DEFAULT 0,
    [is_deleted] BIT NOT NULL CONSTRAINT [Request_is_deleted_df] DEFAULT 0,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [Request_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [Request_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Mentor] ADD CONSTRAINT [Mentor_user_id_fkey] FOREIGN KEY ([user_id]) REFERENCES [dbo].[User]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[MentorSkills] ADD CONSTRAINT [MentorSkills_mentor_id_fkey] FOREIGN KEY ([mentor_id]) REFERENCES [dbo].[Mentor]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[MentorSkills] ADD CONSTRAINT [MentorSkills_skills_id_fkey] FOREIGN KEY ([skills_id]) REFERENCES [dbo].[Skills]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Mentee] ADD CONSTRAINT [Mentee_user_id_fkey] FOREIGN KEY ([user_id]) REFERENCES [dbo].[User]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Request] ADD CONSTRAINT [Request_mentor_id_fkey] FOREIGN KEY ([mentor_id]) REFERENCES [dbo].[Mentor]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Request] ADD CONSTRAINT [Request_mentee_id_fkey] FOREIGN KEY ([mentee_id]) REFERENCES [dbo].[Mentee]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
